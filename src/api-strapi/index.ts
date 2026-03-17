import { strapi } from '@strapi/client';

interface IMeta{
  "pagination": {
    "page": number
    "pageSize": number
    "pageCount": number
    "total": number
  }
}

interface IQury{
  filters?: Record<string, unknown>,
  pagination?: {
    page?: number, pageSize?: number
  },
  sort?: string
}

export const fetchSingle=async <T>(name: string)=>{
  try {
    const client=strapi({baseURL: process.env.API_URL as string, auth: process.env.API_TOKEN})

    const response= await client.single(name).find({pLevel:5} as any)

    return (response as unknown as {data: T}).data
  }catch (e){
    console.log(e)
  }
}

export const fetchColection= async <T>({name, ...query}: {name: string} & IQury)=>{
  try {
    const client=strapi({baseURL: process.env.API_URL as string, auth: process.env.API_TOKEN})

    const response= await client.collection(name).find({
      pLevel:5,
      ...query
    } as any)

    return response as unknown as {data: T[], meta: IMeta}
  }catch (e){
    console.error(e)
  }
}
