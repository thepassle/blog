export function title(title) {
  const str = title.toLowerCase().split('-').join(' ');
  return "Passle blog - " + str.charAt(0).toUpperCase() + str.slice(1)
}
