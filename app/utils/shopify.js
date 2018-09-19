// @flow

import storage from 'store';
import shopifyBuy from 'shopify-buy/dist/shopify-buy.umd';

export const shopClient = shopifyBuy.buildClient({
  accessToken: '255fd3b4e21264d776a80c97539c2413',
  domain: 'lift-co-ltd.myshopify.com',
  appId: '6',
});

export function getCart(): Promise<*> {
  return new Promise(resolve => {
    if (storage.get('cartId')) {
      shopClient.fetchCart(storage.get('cartId')).then(cart => resolve(cart));
    } else {
      shopClient.createCart().then(cart => {
        storage.set('cartId', cart.id);
        resolve(cart);
      });
    }
  });
}
