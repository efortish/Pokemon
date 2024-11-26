
export function playSelectSound() {
  const selectSoundURL = new URL('../assets/audio/select2.mp3', import.meta.url)
  const selectSound = new Audio(selectSoundURL)
  selectSound.volume = 0.6
  selectSound.currentTime = 0
  selectSound.play()
}
