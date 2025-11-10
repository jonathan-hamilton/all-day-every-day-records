import { Box, Button, TextField, MenuItem, FormGroup, FormControlLabel, Checkbox, FormControl, FormLabel, FormHelperText } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent } from "react";
import { Release } from "../types/Release";
import {
  adminUploadImageButtonStyles,
  releaseFormStyles,
} from "../styles/layoutStyles";

interface LabelCheckboxes {
  nickelAndDime: boolean;
  tripleX: boolean;
  ransomNote: boolean;
}

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
}

export default function ReleaseForm({
  form,
  setForm,
  selectedFile,
  setSelectedFile,
  errors,
  setErrors,
  onSubmit,
  isEditing,
  labelCheckboxes,
  onLabelCheckboxChange,
}: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value === "__none__" ? "" : value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setErrors({ ...errors, cover_image_url: "" });
    }
  };

  const fields = [
    { label: "Title", name: "title" },
    { label: "Artist", name: "artist" },
    { label: "Format", name: "format" },
    { label: "Release Date", name: "release_date" },
    { label: "Cover Image URL", name: "cover_image_url" },
    { label: "Description", name: "description", multiline: true, rows: 4 },
    { label: "Spotify URL", name: "spotify_url" },
    { label: "YouTube URL", name: "youtube_url" },
    { label: "Apple Music URL", name: "apple_music_url" },
    { label: "Amazon Music URL", name: "amazon_music_url" },
  ];

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 4 }}>
      <Box sx={releaseFormStyles.gridContainer}>
        {fields.map((field) => (
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
        ))}

        {/* Label Checkboxes */}
        <Box sx={releaseFormStyles.gridItem}>
          <Box sx={{
            backgroundColor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            padding: '18.5px 14px',
            marginTop: '0px',
            height: '56px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.87)'
            },
            '&:focus-within': {
              borderColor: '#1976d2',
              borderWidth: '2px',
              padding: '17.5px 13px'
            }
          }}>
            <FormControl error={!!errors.label} component="fieldset" sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 400, 
                    color: 'rgba(0, 0, 0, 0.6)',
                    margin: 0,
                    minWidth: 'fit-content',
                    lineHeight: '1.4375em'
                  }}
                >
                  Labels
                </FormLabel>
                <FormGroup row sx={{ gap: '24px', flex: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={labelCheckboxes.nickelAndDime}
                        onChange={(e) => onLabelCheckboxChange('nickelAndDime', e.target.checked)}
                        sx={{ 
                          color: 'rgba(0, 0, 0, 0.54)', 
                          '&.Mui-checked': { 
                            color: '#1976d2' 
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          padding: '6px'
                        }}
                      />
                    }
                    label="Nickel and Dime"
                    sx={{ 
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.6)',
                        lineHeight: '1.4375em'
                      }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={labelCheckboxes.tripleX}
                        onChange={(e) => onLabelCheckboxChange('tripleX', e.target.checked)}
                        sx={{ 
                          color: 'rgba(0, 0, 0, 0.54)', 
                          '&.Mui-checked': { 
                            color: '#1976d2' 
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          padding: '6px'
                        }}
                      />
                    }
                    label="Triple X"
                    sx={{ 
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.6)',
                        lineHeight: '1.4375em'
                      }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={labelCheckboxes.ransomNote}
                        onChange={(e) => onLabelCheckboxChange('ransomNote', e.target.checked)}
                        sx={{ 
                          color: 'rgba(0, 0, 0, 0.54)', 
                          '&.Mui-checked': { 
                            color: '#1976d2' 
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          padding: '6px'
                        }}
                      />
                    }
                    label="Ransom Note"
                    sx={{ 
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.6)',
                        lineHeight: '1.4375em'
                      }
                    }}
                  />
                </FormGroup>
              </Box>
              {errors.label && (
                <FormHelperText sx={{ marginTop: '8px' }}>{errors.label}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box sx={releaseFormStyles.gridItem}>
          <TextField
            select
            label="Tag"
            name="tag"
            value={form.tag ?? "__none__"}
            onChange={handleChange}
            error={!!errors.tag}
            helperText={errors.tag}
            fullWidth
            sx={releaseFormStyles.textField}
          >
            <MenuItem value="__none__">None</MenuItem>
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="removed">Removed</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="outlined"
          component="label"
          sx={{
            ...adminUploadImageButtonStyles,
          }}
        >
          Upload Cover Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>

      {selectedFile && (
        <Box display="flex" justifyContent="center" mt={1}>
          <Typography variant="body2">Selected: {selectedFile.name}</Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="center" mt={3}>
        <Button type="submit" variant="contained" sx={{ width: "66%" }}>
          {isEditing ? "Update" : "Create Release"}
        </Button>
      </Box>
    </Box>
  );
}
