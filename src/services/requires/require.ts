import serviceFactory from './factory.js';

export default function entityService(url: string) {
  return serviceFactory(url);
};
