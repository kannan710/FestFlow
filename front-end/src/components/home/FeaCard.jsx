import React from 'react'

export const FeaCard = ({title, des}) => {
  return (
    <div className="border border-gray-600/50 w-50 border-t-0 p-4 flex flex-col justify-center items-center gap-6">
        <h2 className="text-2xl font-medium text-white text-center">{title}</h2>
        <p className="font-light text-md text-gray-400/50 text-center">{des}</p>
    </div>
  )
}
