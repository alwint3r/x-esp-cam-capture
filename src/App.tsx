import {
  Box,
  Button,
  Container,
  Grid,
  styled,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { downloadImage } from "./lib/downloader";
import { upload } from "./lib/uploader";

const TextField = styled(MuiTextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  ":last-child": {
    marginBottom: 0,
  },
}));

function App() {
  const [apiKey, setApiKey] = useState("");
  const [cameraAddr, setCameraAddr] = useState("");
  const [classLabel, setClassLabel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgBlob, setImgBlob] = useState<Blob | null>(null);

  async function onCapture() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const blob = await downloadImage(cameraAddr);
    setImageUrl(URL.createObjectURL(blob));
    setImgBlob(blob);
  }

  async function onUpload() {
    if (!imgBlob) {
      return;
    }

    const random = new Uint16Array(1);
    crypto.getRandomValues(random);

    await upload(
      classLabel,
      apiKey,
      new File([imgBlob], `${classLabel}.${random[0]}.jpeg`)
    );
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 1 }}>
        <Typography variant="h4">ESP32 Cam Capture</Typography>
        <Typography variant="body1">
          Capture image from ESP32 camera and upload it to your Edge Impulse
          project.
        </Typography>
      </Box>

      <Grid container spacing={16}>
        <Grid md={6} item>
          <Box
            sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}
          >
            <TextField
              label="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <TextField
              label="Camera IP address"
              value={cameraAddr}
              onChange={(e) => setCameraAddr(e.target.value)}
            />
            <TextField
              label="Class label"
              value={classLabel}
              onChange={(e) => setClassLabel(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid md={6} item>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="captured image from camera"
              style={{ maxWidth: 320 }}
            />
          ) : null}
        </Grid>
      </Grid>

      <Button variant="contained" size="large" onClick={onCapture}>
        Capture
      </Button>

      <Button variant="contained" size="large" onClick={onUpload}>
        Upload
      </Button>
    </Container>
  );
}

export default App;
