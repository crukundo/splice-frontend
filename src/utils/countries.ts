export interface CountryType {
  code: string;
  label: string;
  phone: string;
  currency?: string;
}

export const allowedCountries = [
  { code: 'NG', label: 'Nigeria', phone: '234', currency: 'NGN' },
  { code: 'KE', label: 'Kenya', phone: '254', currency: 'KES' },
];

export const countries = [
  { code: 'AO', label: 'Angola', phone: '244', currency: 'AOA' },
  { code: 'BF', label: 'Burkina Faso', phone: '226', currency: 'XOF' },
  { code: 'BI', label: 'Burundi', phone: '257', currency: 'BIF' },
  { code: 'BJ', label: 'Benin', phone: '229', currency: 'XOF' },
  { code: 'BW', label: 'Botswana', phone: '267', currency: 'BWP' },
  {
    code: 'CD',
    label: 'Congo, Democratic Republic of the',
    phone: '243',
    currency: 'CDF',
  },
  {
    code: 'CF',
    label: 'Central African Republic',
    phone: '236',
    currency: 'XAF',
  },
  {
    code: 'CG',
    label: 'Congo, Republic of the',
    phone: '242',
    currency: 'XAF',
  },
  { code: 'CI', label: "Cote d'Ivoire", phone: '225', currency: 'XOF' },
  { code: 'CM', label: 'Cameroon', phone: '237', currency: 'XAF' },
  { code: 'CV', label: 'Cape Verde', phone: '238', currency: 'CVE' },
  { code: 'DZ', label: 'Algeria', phone: '213', currency: 'DZD' },
  { code: 'EH', label: 'Western Sahara', phone: '212', currency: 'MAD' },
  { code: 'ER', label: 'Eritrea', phone: '291', currency: 'ERN' },
  { code: 'ET', label: 'Ethiopia', phone: '251', currency: 'ETB' },
  { code: 'GA', label: 'Gabon', phone: '241', currency: 'XAF' },
  { code: 'GH', label: 'Ghana', phone: '233', currency: 'GHS' },
  { code: 'GM', label: 'Gambia', phone: '220', currency: 'GMD' },
  { code: 'GN', label: 'Guinea', phone: '224', currency: 'GNF' },
  { code: 'GQ', label: 'Equatorial Guinea', phone: '240', currency: 'XAF' },
  { code: 'GW', label: 'Guinea-Bissau', phone: '245', currency: 'XOF' },
  { code: 'KE', label: 'Kenya', phone: '254', currency: 'KES' },
  { code: 'KM', label: 'Comoros', phone: '269', currency: 'KMF' },
  { code: 'LR', label: 'Liberia', phone: '231', currency: 'LRD' },
  { code: 'LS', label: 'Lesotho', phone: '266', currency: 'LSL' },
  { code: 'LY', label: 'Libya', phone: '218', currency: 'LYD' },
  { code: 'MA', label: 'Morocco', phone: '212', currency: 'MAD' },
  { code: 'MG', label: 'Madagascar', phone: '261', currency: 'MGA' },
  { code: 'ML', label: 'Mali', phone: '223', currency: 'XOF' },
  { code: 'MR', label: 'Mauritania', phone: '222', currency: 'MRU' },
  { code: 'MU', label: 'Mauritius', phone: '230', currency: 'MUR' },
  { code: 'MW', label: 'Malawi', phone: '265', currency: 'MWK' },
  { code: 'MZ', label: 'Mozambique', phone: '258', currency: 'MZN' },
  { code: 'NA', label: 'Namibia', phone: '264', currency: 'NAD' },
  { code: 'NE', label: 'Niger', phone: '227', currency: 'XOF' },
  { code: 'NG', label: 'Nigeria', phone: '234', currency: 'NGN' },
  { code: 'RW', label: 'Rwanda', phone: '250', currency: 'RWF' },
  { code: 'SC', label: 'Seychelles', phone: '248', currency: 'SCR' },
  { code: 'SD', label: 'Sudan', phone: '249', currency: 'SDG' },
  { code: 'SL', label: 'Sierra Leone', phone: '232', currency: 'SLL' },
  { code: 'SN', label: 'Senegal', phone: '221', currency: 'XOF' },
  { code: 'SO', label: 'Somalia', phone: '252', currency: 'SOS' },
  { code: 'SS', label: 'South Sudan', phone: '211', currency: 'SSP' },
  {
    code: 'ST',
    label: 'Sao Tome and Principe',
    phone: '239',
    currency: 'STN',
  },
  { code: 'SZ', label: 'Swaziland', phone: '268', currency: 'SZL' },
  { code: 'TD', label: 'Chad', phone: '235', currency: 'XAF' },
  { code: 'TG', label: 'Togo', phone: '228', currency: 'XOF' },
  { code: 'TN', label: 'Tunisia', phone: '216', currency: 'TND' },
  {
    code: 'TZ',
    label: 'United Republic of Tanzania',
    phone: '255',
    currency: 'TZS',
  },
  { code: 'UG', label: 'Uganda', phone: '256', currency: 'UGX' },
  { code: 'ZA', label: 'South Africa', phone: '27', currency: 'ZAR' },
  { code: 'ZM', label: 'Zambia', phone: '260', currency: 'ZMW' },
  { code: 'ZW', label: 'Zimbabwe', phone: '263', currency: 'ZWL' },
];
