Place your Photoshop (.psd) files in this folder.

Guidance:
- Copy PSD files into this folder when working locally.
- If PSD files are large, use Git LFS to track them instead of committing directly:
  - `git lfs install`
  - `git lfs track "assets/psd/*.psd"`
  - Commit the `.gitattributes` file that Git LFS creates.
- If you prefer not to track PSDs in Git, add entries to `.gitignore` (for example `assets/psd/*.psd`).

If you want, I can enable Git LFS tracking for this repo or add a sample `.gitattributes` for you.