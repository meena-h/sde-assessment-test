export const addthousandsSeparator = (num) => {
    if(num == null || isNan(num)) return "";

    const [integerPart, fractionPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");

    return fractionalPart 
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};