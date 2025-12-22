/**
 * order service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::order.order', ({ strapi }) => ({

  async deleteGalleryItemsFromCompletedOrder(orderId: number) {
    try {
     
      const order = await strapi.entityService.findOne('api::order.order', orderId, {
        populate: ['items'],
      }) as any;

      if (!order || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
        return;
      }

      const galleryItemDocumentIds = order.items
        .map((item: any) => item.galleryItemDocumentId)
        .filter((id: string | undefined): id is string => Boolean(id));

      if (galleryItemDocumentIds.length === 0) {
        return;
      }

      const deletedGalleryItemIds: number[] = [];

      for (const documentId of galleryItemDocumentIds) {
        try {
  
          const galleryItems = await strapi.documents('api::gallery-item.gallery-item').findMany({
            filters: {
              documentId: {
                $eq: documentId,
              },
            },
            limit: 1,
          });

          if (galleryItems && galleryItems.length > 0 && galleryItems[0].id) {
            const itemId = typeof galleryItems[0].id === 'number' ? galleryItems[0].id : parseInt(galleryItems[0].id);
            deletedGalleryItemIds.push(itemId);
            await strapi.entityService.delete('api::gallery-item.gallery-item', itemId);
            strapi.log.info(`Deleted gallery item with documentId: ${documentId}`);
          }
        } catch (error) {
          strapi.log.error(`Error deleting gallery item ${documentId}:`, error);
        }
      }

      if (deletedGalleryItemIds.length === 0) {
        return;
      }

      const pages = await strapi.entityService.findMany('api::page.page', {
        populate: {
          blocks: {
            on: {
              'blocks.gallery-block': {
                populate: ['gallery_items'],
              },
            },
          },
        },
      }) as any[];

      for (const page of pages) {
        if (!page.blocks || !Array.isArray(page.blocks)) {
          continue;
        }

        const updatedBlocks = page.blocks.filter((block: any) => {
          if (block.__component !== 'blocks.gallery-block') {
            return true;
          }

          const galleryItems = block.gallery_items;
          
          if (!galleryItems || !Array.isArray(galleryItems) || galleryItems.length === 0) {
            return false;
          }

          const hasDeletedItem = galleryItems.some((item: any) => {
            const itemId = typeof item === 'number' ? item : (item?.id || item?.documentId);
            return itemId && deletedGalleryItemIds.includes(Number(itemId));
          });

          return !hasDeletedItem;
        });

        if (updatedBlocks.length !== page.blocks.length) {
          const blocksForUpdate = updatedBlocks.map((block: any) => {
            if (block.__component === 'blocks.gallery-block' && block.gallery_items) {
              return {
                __component: block.__component,
                gallery_items: block.gallery_items.map((item: any) => {
                  return typeof item === 'number' ? item : (item?.id || item);
                }),
              };
            }
            return block;
          });

          await strapi.entityService.update('api::page.page', page.id, {
            data: { blocks: blocksForUpdate },
          });

          strapi.log.info(`Updated page ${page.id}, removed gallery blocks with deleted items`);
        }
      }
    } catch (error) {
      strapi.log.error('Error in deleteGalleryItemsFromCompletedOrder:', error);
      throw error;
    }
  },
}));
