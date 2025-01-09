const splitTextByLength = (text, length) => {
  const lines = [];
  for (let i = 0; i < text.length; i += length) {
    lines.push(text.slice(i, i + length)); 
  }
  return lines.join("\n"); 
};
export default splitTextByLength;
