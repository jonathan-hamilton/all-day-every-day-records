import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, List, Box, TextField, MenuItem, InputAdornment, Select, FormControl, InputLabel, Chip, OutlinedInput } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Release } from "../types/Release";
import ReleaseForm from "./ReleaseForm";
import ReleaseListItem from "./ReleaseListItem.tsx";
import { getApiUrl } from "../utils/api";

const emptyForm: Partial<Release> = {
  title: "",
  artist: "",
  label: "",
  format: "",
  release_date: "",
  cover_image_url: "",
  description: "",
  spotify_url: "",
  youtube_url: "",
  apple_music_url: "",
  amazon_music_url: "",
  tag: "",
};

// Add checkbox state for labels
interface LabelCheckboxes {
  nickelAndDime: boolean;
  tripleX: boolean;
  ransomNote: boolean;
}

export default function Admin() {
  const [form, setForm] = useState<Partial<Release>>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [releases, setReleases] = useState<Release[]>([]);
  
  // Label checkboxes state
  const [labelCheckboxes, setLabelCheckboxes] = useState<LabelCheckboxes>({
    nickelAndDime: false,
    tripleX: false,
    ransomNote: false,
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("artist");

  // Convert checkbox state to label string
  const checkboxesToLabelString = (checkboxes: LabelCheckboxes): string => {
    const labels = [];
    if (checkboxes.nickelAndDime) labels.push("Nickel and Dime");
    if (checkboxes.tripleX) labels.push("Triple X");
    if (checkboxes.ransomNote) labels.push("Ransom Note");
    return labels.join(" / ");
  };

  // Convert label string to checkbox state
  const labelStringToCheckboxes = (labelString: string): LabelCheckboxes => {
    return {
      nickelAndDime: labelString.includes('Nickel and Dime'),
      tripleX: labelString.includes('Triple X'),
      ransomNote: labelString.includes('Ransom Note')
    };
  };

  const handleLabelCheckboxChange = (field: keyof LabelCheckboxes, checked: boolean) => {
    setLabelCheckboxes(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  // Filter and sort releases
  const filteredReleases = releases
    .filter((release) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        release.artist.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Tag filter - show all if no tags selected, or match any selected tag
      const matchesTag = tagFilter.length === 0 || 
        tagFilter.includes(release.tag || "none");
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "date":
          // Use id as proxy for creation order since created_at might not exist
          return parseInt(b.id.toString()) - parseInt(a.id.toString());
        case "artist":
        default:
          return a.artist.localeCompare(b.artist);
      }
    });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || !storedUser.is_admin) {
      navigate("/login");
    } else {
      fetchReleases();
    }
  }, [navigate]);

  const fetchReleases = async () => {
    try {
      // Add cache-busting parameter to ensure fresh data
      const timestamp = Date.now();
      const res = await fetch(
        `https://nickelanddimerecords.com/api/get-releases.php?admin=true&_=${timestamp}`,
        {
          credentials: "include",
          cache: "no-cache", // Disable browser caching
        }
      );
      const data = await res.json();
      if (data.success) {
        setReleases([...data.releases]);
      }
    } catch (err) {
      console.error("Failed to fetch releases", err);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title?.trim()) newErrors.title = "Title is required.";
    if (!form.artist?.trim()) newErrors.artist = "Artist is required.";
    
    // Check if at least one label checkbox is selected
    if (!labelCheckboxes.nickelAndDime && !labelCheckboxes.tripleX && !labelCheckboxes.ransomNote) {
      newErrors.label = "At least one label must be selected.";
    }
    
    if (!form.format?.trim()) newErrors.format = "Format is required.";
    if (!form.release_date?.trim()) {
      newErrors.release_date = "Release date is required.";
    } else {
      // Require 4-digit year format (YYYY)
      const yyyyRegex = /^\d{4}$/;
      if (!yyyyRegex.test(form.release_date.trim())) {
        newErrors.release_date = "Release date must be a 4-digit year (e.g., 1987).";
      }
    }
    if (!form.description?.trim())
      newErrors.description = "Description is required.";

    const coverImageUrl = form.cover_image_url?.trim();
    if (!coverImageUrl && !selectedFile) {
      newErrors.cover_image_url = "Cover Image is Required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setStatus("Submitting...");

    try {
      let imageUrl = form.cover_image_url;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch(
          `https://nickelanddimerecords.com/api/upload-image.php`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
          setStatus(`❌ Image upload failed: ${uploadResult.error}`);
          return;
        }

        imageUrl = uploadResult.url;
      }

      const releaseData = { 
        ...form, 
        cover_image_url: imageUrl,
        release_date: convertDisplayDateToDbDate(form.release_date || ""),
        label: checkboxesToLabelString(labelCheckboxes)
      };

      const response = await fetch(
        getApiUrl('upsert-release.php'),
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(releaseData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setStatus("✅ Release updated successfully!");
        setTimeout(() => setStatus(null), 3000);
        setForm(emptyForm);
        setLabelCheckboxes({ nickelAndDime: false, tripleX: false, ransomNote: false });
        setSelectedFile(null);
        setErrors({});
        // Refresh the releases data to get the latest values
        await fetchReleases();
      } else {
        setStatus(`❌ Error: ${result.error || "Something went wrong."}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to submit release.");
    }
  };

  const handleEdit = (release: Release) => {
    // Convert database date format to MM/YYYY for display
    const convertedRelease = {
      ...release,
      release_date: convertDbDateToDisplayDate(release.release_date)
    };
    setForm(convertedRelease);
    setLabelCheckboxes(labelStringToCheckboxes(release.label || ''));
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Convert database date (YYYY-MM-DD or similar) to YYYY
  const convertDbDateToDisplayDate = (dbDate: string): string => {
    if (!dbDate || dbDate === "0000-00-00") return "";
    
    // Handle YYYY-MM-DD format - extract just the year
    if (dbDate.includes("-")) {
      const parts = dbDate.split("-");
      const year = parts[0];
      if (year && year !== "0000") {
        return year; // Return just the year
      }
    }
    
    // If it's already just a year (YYYY), return as is
    if (dbDate.match(/^\d{4}$/)) {
      return dbDate;
    }
    
    // Legacy support for MM/YYYY format
    if (dbDate.match(/^\d{2}\/\d{4}$/)) {
      const parts = dbDate.split("/");
      return parts[1]; // Return just the year part
    }
    
    return "";
  };

  // Convert YYYY to YYYY-01-01 for database storage
  const convertDisplayDateToDbDate = (displayDate: string): string => {
    if (!displayDate) return "";
    
    // Check if it's a 4-digit year
    const yyyyRegex = /^\d{4}$/;
    if (yyyyRegex.test(displayDate)) {
      return `${displayDate}-01-01`; // Convert YYYY to YYYY-01-01
    }
    
    // Legacy support for MM/YYYY format (in case any old data exists)
    const mmYYYYRegex = /^(0[1-9]|1[0-2])\/(\d{4})$/;
    if (mmYYYYRegex.test(displayDate)) {
      const [month, year] = displayDate.split("/");
      return `${year}-${month.padStart(2, "0")}-01`;
    }
    
    return displayDate; // Return as-is if not in expected format
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this release? This action cannot be undone."))
      return;

    try {
      const res = await fetch(
        `https://nickelanddimerecords.com/api/delete-release.php`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const result = await res.json();
      if (result.success) {
        fetchReleases();
      }
    } catch (err) {
      console.error("Failed to delete release", err);
    }
  };

  return (
    <Container maxWidth="lg">
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
      />
      {status && (
        <Typography sx={{ mt: 2 }} color="textSecondary">
          {status}
        </Typography>
      )}
      <Typography
        variant="h5"
        sx={{ mt: 2, textAlign: "center" }}
        color="textSecondary"
      >
        Existing Releases
      </Typography>
      
      {/* Search and Filter Bar */}
      <Box sx={{ 
        mt: 2, 
        mb: 3, 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" }, 
        gap: 2,
        maxWidth: "66%", // Match the form width
        mx: "auto" // Center align like the form
      }}>
        <TextField
          label="Search releases..."
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl fullWidth sx={{ backgroundColor: "white" }}>
          <InputLabel>Filter by Tags</InputLabel>
          <Select
            multiple
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value as string[])}
            input={<OutlinedInput label="Filter by Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip 
                    key={value} 
                    label={value === "none" ? "No Tag" : value} 
                    size="small" 
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="none">No Tag</MenuItem>
            <MenuItem value="removed">Removed</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          select
          label="Sort by"
          size="medium"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white" }}
        >
          <MenuItem value="artist">Artist A-Z</MenuItem>
          <MenuItem value="title">Title A-Z</MenuItem>
          <MenuItem value="date">Date Added</MenuItem>
        </TextField>
      </Box>
      
      {/* Results count */}
      <Box sx={{ maxWidth: "66%", mx: "auto" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Showing {filteredReleases.length} of {releases.length} releases
        </Typography>
      </Box>
      
      <Box sx={{ maxWidth: "66%", mx: "auto" }}>
        <List sx={{ 
          maxHeight: "500px", 
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "white",
          margin: 0,
          padding: 0
        }}>
          {filteredReleases.map((release) => (
            <ReleaseListItem
              key={release.id}
              release={release}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </List>
      </Box>
    </Container>
  );
}
