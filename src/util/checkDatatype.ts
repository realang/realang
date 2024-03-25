const datatypeRegex = {
  alphabet: /^[A-Za-z_]+$/,
  integer: /^[0-9]+$/,
  whitespace: /^[\s]+$/,
} as const;

type Datatype = keyof typeof datatypeRegex;

export const checkDatatype = (data: string, type: Datatype) => {
  return datatypeRegex[type].test(data);
};
