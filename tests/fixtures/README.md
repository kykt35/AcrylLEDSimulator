# Release E2E fixtures

These fixtures are repository-owned test data and may be redistributed with the project.

- `release-source.png.base64`: a generated 1 x 1 PNG encoded as Base64. E2E tests decode it and upload it as `release-source.png` with MIME type `image/png`.
- `broken.png`: intentionally invalid PNG bytes used to verify decode-error recovery.
- `not-png.txt`: plain text used to verify MIME-type validation and retry behavior.

Keeping the valid PNG as Base64 makes the fixture reviewable as text while preserving a deterministic binary input at test runtime.
