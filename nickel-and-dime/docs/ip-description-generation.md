# AI Description Generation - Implementation Plan

## Overview
Implementation of AI-powered description generation for music releases using OpenAI GPT-3.5-turbo. This feature allows admins to automatically generate descriptions for Artist/Album releases by clicking a button next to the Description field.

## Requirements Summary
- **Users**: Admin-only feature (leverages existing authentication)
- **AI Service**: OpenAI GPT-3.5-turbo
- **Character Limit**: 400 characters
- **Rate Limiting**: Unlimited for admins
- **UI**: Small button to the right of Description field
- **Integration**: Works for both creating and editing releases
- **Error Handling**: Show error message with retry capability

## Phase 1: Core Implementation

### 1. Backend Implementation

#### 1.1 Configuration Setup
**File**: `api/config.php`

Add OpenAI configuration to existing config array:

```php
// Add to existing $config array
'openai' => [
    'api_key' => $_ENV['OPENAI_API_KEY'] ?? '',
    'model' => 'gpt-3.5-turbo',
    'max_tokens' => 600, // Allow buffer for 400 char limit
    'temperature' => 0.7, // Creative but focused
    'timeout' => 30 // 30 second timeout
]
```

**File**: `api/config-local.php`

Add development configuration:

```php
// Add to existing $config array
'openai' => [
    'api_key' => $_ENV['OPENAI_API_KEY'] ?? 'your-dev-key-here',
    'model' => 'gpt-3.5-turbo',
    'max_tokens' => 600,
    'temperature' => 0.7,
    'timeout' => 30
]
```

#### 1.2 New API Endpoint
**File**: `api/generate-description.php`

```php
<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication for this endpoint
$user = requireAuth();

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Method not allowed"], 405);
}

// Get and validate input data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["artist"]) || !isset($data["title"])) {
    jsonResponse(["error" => "Missing artist or title"], 400);
}

$artist = trim($data["artist"]);
$title = trim($data["title"]);

if (empty($artist) || empty($title)) {
    jsonResponse(["error" => "Artist and title cannot be empty"], 400);
}

try {
    $config = getConfig();
    $openaiConfig = $config['openai'];
    
    if (empty($openaiConfig['api_key'])) {
        jsonResponse(["error" => "OpenAI API key not configured"], 500);
    }
    
    // Create the prompt
    $prompt = createDescriptionPrompt($artist, $title);
    
    // Call OpenAI API
    $description = generateWithOpenAI($prompt, $openaiConfig);
    
    // Validate and trim to character limit
    $description = validateAndTrimDescription($description, 400);
    
    jsonResponse([
        "success" => true,
        "description" => $description
    ]);
    
} catch (Exception $e) {
    error_log("OpenAI generation error: " . $e->getMessage());
    jsonResponse(["error" => "Failed to generate description. Please try again."], 500);
}

function createDescriptionPrompt($artist, $title) {
    return "Write a concise description about the music artist \"$artist\" and their album/release \"$title\". " .
           "Focus on the band's history, musical style, significance in their genre, and the context of this specific release. " .
           "Keep it informative and engaging for music fans. Limit to approximately 400 characters.";
}

function generateWithOpenAI($prompt, $config) {
    $url = 'https://api.openai.com/v1/chat/completions';
    
    $data = [
        'model' => $config['model'],
        'messages' => [
            [
                'role' => 'user',
                'content' => $prompt
            ]
        ],
        'max_tokens' => $config['max_tokens'],
        'temperature' => $config['temperature']
    ];
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_TIMEOUT => $config['timeout'],
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $config['api_key']
        ]
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("cURL error: " . $error);
    }
    
    if ($httpCode !== 200) {
        throw new Exception("OpenAI API error: HTTP $httpCode");
    }
    
    $result = json_decode($response, true);
    
    if (!$result || !isset($result['choices'][0]['message']['content'])) {
        throw new Exception("Invalid OpenAI response format");
    }
    
    return trim($result['choices'][0]['message']['content']);
}

function validateAndTrimDescription($description, $maxLength) {
    // Remove any quotes that might wrap the response
    $description = trim($description, '"\'');
    
    // If description is longer than max length, trim to last complete sentence
    if (strlen($description) > $maxLength) {
        $trimmed = substr($description, 0, $maxLength);
        $lastPeriod = strrpos($trimmed, '.');
        
        if ($lastPeriod !== false && $lastPeriod > $maxLength * 0.7) {
            // If we find a period in the last 30% of the text, cut there
            return substr($trimmed, 0, $lastPeriod + 1);
        } else {
            // Otherwise, cut at last space to avoid cutting words
            $lastSpace = strrpos($trimmed, ' ');
            return substr($trimmed, 0, $lastSpace) . '...';
        }
    }
    
    return $description;
}
?>
```

### 2. Frontend Implementation

#### 2.1 Update ReleaseForm Component
**File**: `src/pages/ReleaseForm.tsx`

Add new props interface:

```typescript
interface Props {
  form: Partial<Release>;
  setForm: (value: Partial<Release>) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  labelCheckboxes: LabelCheckboxes;
  onLabelCheckboxChange: (field: keyof LabelCheckboxes, checked: boolean) => void;
  // New prop for AI generation
  onGenerateDescription?: (artist: string, title: string) => Promise<string>;
}
```

Update the Description field rendering:

```typescript
// In the fields.map() section, modify the Description field handling:
{fields.map((field) => {
  if (field.name === 'description') {
    return (
      <Box key={field.name} sx={releaseFormStyles.gridItem}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            sx={releaseFormStyles.textField}
            label={field.label}
            name={field.name}
            value={form[field.name as keyof Release] || ""}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            fullWidth
            multiline={field.multiline || false}
            rows={field.rows || undefined}
          />
          {onGenerateDescription && (
            <GenerateDescriptionButton
              onGenerate={() => handleGenerateDescription()}
              disabled={!form.artist?.trim() || !form.title?.trim()}
            />
          )}
        </Box>
      </Box>
    );
  }
  
  // Regular field rendering for non-description fields
  return (
    <Box key={field.name} sx={releaseFormStyles.gridItem}>
      <TextField
        sx={releaseFormStyles.textField}
        label={field.label}
        name={field.name}
        value={form[field.name as keyof Release] || ""}
        onChange={handleChange}
        error={!!errors[field.name]}
        helperText={errors[field.name]}
        fullWidth
        multiline={field.multiline || false}
        rows={field.rows || undefined}
      />
    </Box>
  );
})}
```

Add handler function:

```typescript
const handleGenerateDescription = async () => {
  if (!onGenerateDescription || !form.artist?.trim() || !form.title?.trim()) {
    return;
  }
  
  try {
    const description = await onGenerateDescription(form.artist, form.title);
    setForm({ ...form, description });
    // Clear any existing description errors
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
  } catch (error) {
    console.error('Failed to generate description:', error);
    // Error handling is done in the parent component
  }
};
```

#### 2.2 Create GenerateDescriptionButton Component
**File**: `src/components/GenerateDescriptionButton.tsx`

```typescript
import React, { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

interface GenerateDescriptionButtonProps {
  onGenerate: () => Promise<void>;
  disabled?: boolean;
}

export default function GenerateDescriptionButton({ 
  onGenerate, 
  disabled = false 
}: GenerateDescriptionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onGenerate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={disabled ? "Enter Artist and Title first" : "Generate AI Description"}>
      <span>
        <IconButton
          onClick={handleClick}
          disabled={disabled || loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '&:disabled': {
              backgroundColor: '#f9f9f9',
            }
          }}
          size="small"
        >
          {loading ? (
            <CircularProgress size={16} />
          ) : (
            <AutoAwesome fontSize="small" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
```

#### 2.3 Update Admin Component
**File**: `src/pages/Admin.tsx`

Add state for generation status:

```typescript
// Add to existing state
const [generationStatus, setGenerationStatus] = useState<string | null>(null);
```

Add generation handler:

```typescript
const handleGenerateDescription = async (artist: string, title: string): Promise<string> => {
  setGenerationStatus("Generating description...");
  
  try {
    const response = await fetch(
      `https://nickelanddimerecords.com/api/generate-description.php`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist, title }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to generate description");
    }

    setGenerationStatus("✅ Description generated successfully!");
    setTimeout(() => setGenerationStatus(null), 3000);
    
    return result.description;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    setGenerationStatus(`❌ Generation failed: ${errorMessage}`);
    setTimeout(() => setGenerationStatus(null), 5000);
    throw error;
  }
};
```

Update ReleaseForm props:

```typescript
<ReleaseForm
  form={form}
  setForm={setForm}
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  errors={errors}
  setErrors={setErrors}
  onSubmit={handleSubmit}
  isEditing={!!form.id}
  labelCheckboxes={labelCheckboxes}
  onLabelCheckboxChange={handleLabelCheckboxChange}
  onGenerateDescription={handleGenerateDescription}
/>

{/* Add status display after existing status */}
{generationStatus && (
  <Typography sx={{ mt: 1 }} color="textSecondary">
    {generationStatus}
  </Typography>
)}
```

### 3. Styling Updates

#### 3.1 Update Layout Styles
**File**: `src/styles/layoutStyles.ts`

Add styles for the generate button positioning:

```typescript
export const generateDescriptionButtonStyles = {
  position: 'absolute',
  right: 8,
  top: 8,
  backgroundColor: 'white',
  border: '1px solid #ccc',
  zIndex: 1,
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&:disabled': {
    backgroundColor: '#f9f9f9',
  }
};
```

### 4. Environment Setup

#### 4.1 OpenAI API Key Configuration

**Development Setup:**
1. Add to local environment variables or config-local.php:
```bash
export OPENAI_API_KEY="your-development-api-key"
```

**Production Setup:**
1. Add to production config.php:
```php
'openai' => [
    'api_key' => $_ENV['OPENAI_API_KEY'] ?? 'your-production-api-key',
    // ... other config
]
```

### 5. Testing Strategy

#### 5.1 Manual Testing Checklist

**Basic Functionality:**
- [ ] Generate button appears next to Description field
- [ ] Button is disabled when Artist or Title is empty
- [ ] Button shows loading state during generation
- [ ] Generated description populates the field
- [ ] Character limit is respected (≤400 characters)

**Error Scenarios:**
- [ ] Invalid API key shows appropriate error
- [ ] Network timeout shows retry option
- [ ] Empty Artist/Title shows validation message
- [ ] OpenAI service unavailable shows error message

**Integration Testing:**
- [ ] Generated description saves with release data
- [ ] Works for both new and existing releases
- [ ] Doesn't interfere with manual description editing
- [ ] Form validation continues to work

#### 5.2 Error Handling Test Cases

1. **Missing API Key**: Should show "Configuration error" message
2. **Network Timeout**: Should show "Service unavailable, try again" 
3. **Invalid Response**: Should show "Generation failed, try again"
4. **Rate Limit Hit**: Should show "Service busy, try again later"

### 6. Deployment Steps

#### 6.1 Backend Deployment
1. Upload `generate-description.php` to `/api/` directory
2. Update `config.php` with OpenAI configuration
3. Set OpenAI API key in environment or config
4. Test endpoint with curl/Postman

#### 6.2 Frontend Deployment
1. Build React application: `npm run build`
2. Upload updated frontend files
3. Test generate button functionality
4. Verify error handling works

#### 6.3 Security Verification
- [ ] API key not exposed in client-side code
- [ ] Endpoint requires admin authentication
- [ ] Input validation prevents injection attacks
- [ ] Error messages don't leak sensitive information

## Phase 2: Future Enhancements

### External Data Integration
- Add Discogs API integration for band history
- Include genre and year information in prompts
- Enhanced prompts with additional context

### Advanced Features
- Multiple description style options
- Description history/versioning  
- Bulk generation for multiple releases
- Custom prompt templates

## Cost Estimation

**Per Description Generation:**
- Average tokens per request: ~700 (prompt + response)
- Cost per generation: ~$0.0014 (less than 0.2 cents)
- Monthly cost for 50 generations: ~$0.07

**Annual Cost Projection:**
- Conservative estimate (200 generations/year): ~$0.28
- Heavy usage (1000 generations/year): ~$1.40

## Risk Mitigation

1. **API Failures**: Clear error messages with retry functionality
2. **Cost Control**: Admin-only access naturally limits usage
3. **Content Quality**: 400-character limit ensures concise output
4. **Security**: API key stored server-side, not exposed to client

## Success Metrics

- Admin adoption rate (% of releases using AI generation)
- Description quality (subjective evaluation)
- Time savings vs manual description writing
- Error rate and user satisfaction

---

## Getting Started

1. **Set up OpenAI account** and obtain API key
2. **Configure API key** in config.php
3. **Deploy backend** generate-description.php endpoint  
4. **Update frontend** with new button component
5. **Test functionality** with sample Artist/Title data
6. **Deploy to production** and train admin users

This implementation provides a solid foundation for AI-powered description generation while maintaining the existing architecture and user experience.