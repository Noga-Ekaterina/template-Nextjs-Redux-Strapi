'use client'
import React, {FC, JSX, useCallback, useEffect, useState} from "react";
import parse from "html-react-parser";
import Link from 'next/link';
import { useGetHashPosition } from "@/app/scroll/hooks/useGetHashPosition";
import { smoothScroll } from "@/app/scroll/utils/smoothScroll";

interface Props{
  html: string| JSX.Element[] | null |undefined
}

const HtmlProcessing = ({html}:Props) => {
  const getHashPosition= useGetHashPosition()

  const handleHashed=useCallback((event:  React.MouseEvent<HTMLAnchorElement, MouseEvent>)=>{
    event.preventDefault()

    const targetElement = event.target as HTMLElement;

    const hash = targetElement.getAttribute("href")
        ?? targetElement.closest("a")?.getAttribute("href");

    if (!hash) return

    smoothScroll(getHashPosition(hash))

    setTimeout(()=> window.location.hash=hash.slice(1))
  }, [getHashPosition])

  const replaceWithLink = (element: JSX.Element, index: number): JSX.Element => {
    const uniqueId = element.props?.id || element.key ||element.props?.className || element.props?.href || `key-${index}`; // Используем id или href, если доступны
    const key = `${uniqueId}-${element.type}-${index}`; // Уникальный ключ на основе id/href и типа элемента
    const props = {...element.props, key};
    
    const color: undefined|string=props.style?.color

    if(color &&(color=="#000" ||color=="#000000" || color==="rgb(0, 0, 0)") ){
      delete props.style?.color
    }

    if (element.type === 'a') {
      if (props.download) {
        let href: string=props.href
        href=`${href}${href.includes("?")? "&":"?"}download=1`
        return React.createElement("a", {...props, href}, props.children);
      }
      else if (props.href.startsWith('/') && !props.download)
        return React.createElement(Link, { href: props.href, ...props }, props.children);
      else if (props.href.startsWith('#') && !props.download)
        return React.createElement("a", { to: props.href, onClick: handleHashed, ...props }, props.children);
      // else if (props.href.startsWith("copy:"))
      //   return React.createElement(CopyText, { text: props.href.replace("copy:", ""), className: props.className, key}, props.children);
    }

    if (props && props.children) {
      const newChildren = Array.isArray(props.children)
          ? props.children.map((child: JSX.Element, childIndex: number) => replaceWithLink(child, childIndex))
          : replaceWithLink(props.children, 0); // Используем 0 для единственного дочернего элемента
      return React.createElement(element.type, { ...props }, newChildren);
    }
    return element;
  };


  const parseHtml=()=>{

    if (html===null) return

    // Убираем пустые теги <p></p>
    let str = typeof html ==="string"&&
        html.replace("<p></p>", '')
            .replaceAll("^", "&nbsp;")
            .replaceAll("~", "<br>");

    const jsx = str? parse(str):html

    if (typeof jsx=="object"){
      if (Array.isArray(jsx))
        return (jsx.map(el=> replaceWithLink(el, 0)))
      else
        return([replaceWithLink(jsx, 0)])
    }
  }
  const [elements, setElements] = useState<JSX.Element[] |undefined>(parseHtml())

  useEffect(() => {
    setElements(parseHtml())
  }, [html]);

  return (
      <>
        {
          elements?.map((el, index)=>{
            return React.createElement(el.type, {...el.props, key:index+ Date.now()}, el.props.children)
          })
        }
      </>
  );
}

export default HtmlProcessing
