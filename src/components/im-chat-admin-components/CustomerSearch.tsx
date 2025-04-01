import {SearchOutlined} from "@ant-design/icons"
import {Input} from "antd"

export const CustomerSearch = () => {
  return (
    <div className="px-3 mb-3">
      <Input
        placeholder="Search by name or ID..."
        prefix={<SearchOutlined className="mr-2 text-2xl text-gray-400"/>}
        className="bg-white border-1 p-3 rounder-xl !outline-none"
      />
    </div>
  )
}