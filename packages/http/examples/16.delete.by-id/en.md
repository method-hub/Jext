# Delete a user

[Русская версия](ru.md)

`DELETE /users/4` answers `204 No Content`: success without a body. Every tab returns `true` when the user is deleted.

<!-- @variants -->

## What differs

- **jext** sees the empty body and returns `data: null` without trying to decode it; the check is `error`.
- **fetch**: do not call `.json()` on a 204, it throws on an empty body; `response.ok` is enough.
- **XMLHttpRequest** reports the 204 in `onload` like any other status.
- **axios**, **ky** and **ofetch** throw for an error status, which the tab catches, so reaching `return true` means
  success.
