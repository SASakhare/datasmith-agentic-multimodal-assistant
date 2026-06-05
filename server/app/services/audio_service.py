from faster_whisper import WhisperModel
import tempfile
import os


model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8",
)


def transcribe_audio(file_bytes: bytes) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
        temp_file.write(file_bytes)
        temp_file_path = temp_file.name

    segments, _ = model.transcribe(temp_file_path)

    os.remove(temp_file_path)

    text = " ".join([segment.text for segment in segments])

    return text.strip()
