"use client"
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { IImage, IImageSize, IMediaSizes } from '@/types/tehnic';
import React, {memo, useEffect, useState} from 'react';

export interface Props {
  image?: IImage;
  size?: IImageSize;
  mediaSizes?: IMediaSizes;
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}


const Image: React.FC<Props> = ({
  image,
  size,
  mediaSizes,
  className,
  alt,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const breakpoints = useBreakpoints();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, []);

  if(!image)
    return <img src='' className=''/>

  // Определяем размер на основе медиа-запросов
  const getSizeForBreakpoint = (): IImageSize | undefined => {
    if (!mediaSizes) return size;

    // Определяем приоритет: wide -> desktop -> tablet -> mobile
    if (breakpoints.isBigDesktop && mediaSizes.bigDesktop) return mediaSizes.bigDesktop;
    if (breakpoints.isDesktop && mediaSizes.desktop) return mediaSizes.desktop;
    if (breakpoints.isLaptop && mediaSizes.laptop) return mediaSizes.laptop;
    if (breakpoints.isTablet && mediaSizes.tablet) return mediaSizes.tablet;
    if (breakpoints.isMobile && mediaSizes.mobile) return mediaSizes.mobile;

    return size;
  };

  // Получаем оптимальное изображение
  const getOptimalImage = (): {
    url: string;
    width: number;
    height: number;
    size: number;
  } => {
    const targetSize = getSizeForBreakpoint();

    // Проверяем наличие формата
    const format = (image.formats && targetSize) && image.formats[targetSize];

    if (!format) {
      // Формат отсутствует, используем оригинал
      return {
        url: image.url,
        width: image.width,
        height: image.height,
        size: image.size,
      };
    }

    // Проверяем, легче ли формат оригинала
    const isLighter = format.size < image.size;

    if (isLighter) {
      return {
        url: format.url,
        width: format.width,
        height: format.height,
        size: format.size,
      };
    }

    // Формат тяжелее или равен оригиналу, используем оригинал
    return {
      url: image.url,
      width: image.width,
      height: image.height,
      size: image.size,
    };
  };


  const optimalImage = isClient? getOptimalImage() : image.formats?.thumbnail|| image;
  const finalAlt = alt || image.alternativeText || '';

  return (
    <img
      src={`${process.env.NEXT_PUBLIC_IMAGES_URL}${optimalImage.url}?date=${image.updatedAt}`}
      alt={finalAlt}
      className={className}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default memo(Image);