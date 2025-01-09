const handleCopy = (Massage) => {
  const textToCopy = Massage;
  navigator.clipboard.writeText(textToCopy);
};
export default handleCopy;
