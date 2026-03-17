
export interface IWithClass {
  className?: string
}

export interface IWithChildren {
  children?: ReactNode
}

export type IImageSize = 'xxl' | 'xl' | 'large' | 'medium' | 'small' | 'xs' | 'thumbnail';

export interface IImageFormat {
  url: string;
  width: number;
  height: number;
  size: number; // в байтах
  mime?: string;
  ext?: string;
}

export interface IImageFormats  {
  xxl?: IImageFormat;
  xl?: IImageFormat;
  large?: IImageFormat;
  medium?: IImageFormat;
  small?: IImageFormat;
  xs?: IImageFormat;
  thumbnail?: IImageFormat;
}

export interface IFile{
  id: number;
  url: string;
  size: number; // размер оригинала в байтах
  updatedAt: string
}

export interface IImage extends IFile{
  alternativeText?: string;
  caption?: string;
  name?: string;
  width: number;
  height: number;
  formats: null | IImageFormats;
}

export interface IMediaSizes {
  mobile?: IImageSize;
  tablet?: IImageSize;
  laptop?: IImageSize;
  desktop?: IImageSize;
  bigDesktop?: IImageSize;
}

export interface IHtml{
  text: string
}