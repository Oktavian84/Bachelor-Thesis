import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAboutBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_about_blocks';
  info: {
    displayName: 'About Block';
  };
  attributes: {
    content: Schema.Attribute.Text;
    headline: Schema.Attribute.String;
    reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlocksContactBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_blocks';
  info: {
    displayName: 'Contact Block';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    content: Schema.Attribute.Text;
    cta: Schema.Attribute.Component<'elements.link', true>;
    email: Schema.Attribute.Email;
    headline: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
    number: Schema.Attribute.String;
  };
}

export interface BlocksExhibitionBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_exhibition_blocks';
  info: {
    displayName: 'Exhibition Block';
  };
  attributes: {
    exhibition: Schema.Attribute.Relation<
      'oneToOne',
      'api::exhibition.exhibition'
    >;
  };
}

export interface BlocksFaqBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faq_blocks';
  info: {
    displayName: 'FAQ Block';
  };
  attributes: {
    content: Schema.Attribute.Text;
    headline: Schema.Attribute.String;
    reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlocksGalleryBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_gallery_blocks';
  info: {
    displayName: 'Gallery Block';
  };
  attributes: {
    gallery_items: Schema.Attribute.Relation<
      'oneToMany',
      'api::gallery-item.gallery-item'
    >;
  };
}

export interface BlocksHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_sections';
  info: {
    displayName: 'Hero Section';
  };
  attributes: {
    cta: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlocksInfoBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_info_blocks';
  info: {
    displayName: 'Info Block';
  };
  attributes: {
    content: Schema.Attribute.Text;
    headline: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlocksPrivacyBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_privacy_blocks';
  info: {
    displayName: 'Privacy Block';
  };
  attributes: {
    content: Schema.Attribute.Text;
    headline: Schema.Attribute.String;
    reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface ElementsLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logo';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    logoText: Schema.Attribute.String;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    copy: Schema.Attribute.String;
    logo: Schema.Attribute.Component<'elements.logo', false>;
    policies: Schema.Attribute.Component<'elements.link', true>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    logo: Schema.Attribute.Component<'elements.logo', false>;
    navigation: Schema.Attribute.Component<'elements.link', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.about-block': BlocksAboutBlock;
      'blocks.contact-block': BlocksContactBlock;
      'blocks.exhibition-block': BlocksExhibitionBlock;
      'blocks.faq-block': BlocksFaqBlock;
      'blocks.gallery-block': BlocksGalleryBlock;
      'blocks.hero-section': BlocksHeroSection;
      'blocks.info-block': BlocksInfoBlock;
      'blocks.privacy-block': BlocksPrivacyBlock;
      'elements.link': ElementsLink;
      'elements.logo': ElementsLogo;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
    }
  }
}
