

const parseСontactType = (contactType) => {
  const isString = typeof contactType === 'string';
  
  if (!isString) return;
  
  const isСontactType = (contactType) => ['work', 'home', 'personal'].includes(contactType);
  if (isСontactType(contactType)) return contactType;
};

const parseIsFavourite = (isFavourite) => {
  if(typeof isFavourite !== 'string') return undefined;
  return (isFavourite==='true')? true : false;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite, } = query;

  const parsedСontactType = parseСontactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  
  return {
    contactType: parsedСontactType,
    isFavourite: parsedIsFavourite,
  };
};