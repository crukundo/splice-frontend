export const formatPhoneNumber = (
  phoneNumber: string | undefined,
  countryCode: string | undefined
): string => {
  // Remove white spaces
  phoneNumber = phoneNumber?.replace(/\s/g, "")

  // Remove the country code and add '0' before '7'
  if (phoneNumber?.startsWith(`+${countryCode}`)) {
    phoneNumber = phoneNumber.replace(`+${countryCode}`, "0")
  }

  return phoneNumber as string
}
