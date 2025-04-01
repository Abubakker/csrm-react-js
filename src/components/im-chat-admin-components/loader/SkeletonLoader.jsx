import {Skeleton} from "antd"

export const SkeletonLoader = () => {
  return (
    Array.from({ length: 15 }).map((_, index) => (
      <Skeleton
        key={index}
        avatar={{ shape: 'circle', size: 48 }}
        active
        paragraph={{ rows: 1 }}
        className="rounded-lg p-4"
      />
    ))
  )
}