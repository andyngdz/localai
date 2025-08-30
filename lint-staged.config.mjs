const config = {
  '*.{js,jsx,ts,tsx}': [() => 'tsc --noEmit', 'npm run lint'],
  '*.{js,jsx,ts,tsx,json,md}': 'npm run format'
}

export default config
