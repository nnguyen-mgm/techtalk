const Token = ({ val }) => {
  if (val === null) {
    return '- Ⓣ';
  }
  return `${(val / (10 ** 18)).toFixed(2)} Ⓣ`;
};

export default Token;
