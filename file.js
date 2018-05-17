const fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png']

export function validFileType(file) {
  for (var i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true
    }
  }
  return false
}
