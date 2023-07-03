export default function IsNumber(number: string) {
  const re = /^[0-9\b]+$/;
  if (re.test(number)) {
    return true;
  } else {
    return false;
  }
}
