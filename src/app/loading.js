import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="min-h-[630px] relative w-full h-full bg-[#111e3b] mt-5">
        <div className="absolute top-[calc(50%-150px)] left-[calc(50%-150px)] flex items-center justify-center border-[10px] rounded-full w-[300px] h-[300px]">
          <h1 className="text-3xl font-extrabold text-white">GIHU JOBS</h1>
        </div>
      </Skeleton>
    </div>
  );
}

export default Loading