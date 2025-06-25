
export const validateBody = (schema) => async (req, res, next) => {
 console.log('rrrrrrrrrrrrrrrrrrrr=');
  let r = await schema.validateAsync(req.body, {
    abortEarly: false,
    convert: false,
    allowUnknown: false,
  });
  console.log('rrrrrrrrrrrrrrrrrrrr=', r);
  next();
};