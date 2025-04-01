import {Modal, Button, Input} from 'antd'
import PropTypes from "prop-types"
import {TextArea} from "antd-mobile"
import {useState} from "react"
import {useTranslation} from "react-i18next"

const OfflineMessageModal = ({ visible, onCancel, onConfirm }) => {

  const [buttonContent, setButtonContent] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const {t} = useTranslation()
  
  const handleSubmit = async () => {
    if (buttonContent === "" || replyMessage === "") {
      return
    }
    await onConfirm({buttonContent, replyMessage})
    setButtonContent("")
    setReplyMessage("")
    onCancel()
  }

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={t('add_new_offline_button_and_reply_message')}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('cancel')}
        </Button>,
        <Button key="confirm" type="primary" onClick={handleSubmit}>
          {t('save')}
        </Button>,
      ]}
      className="p-6"
    >
        <div className="py-3">
          <Input
            placeholder={t('enter_button_content')}
            className="p-[10px]"
            value={buttonContent}
            onChange={(e) => setButtonContent(e.target.value)}
          />

          <TextArea
            placeholder={t('auto_reply_message')}
            rows={3}
            className="mt-2 p-[10px] bg-white border rounded-lg"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e)}
          />
        </div>
    </Modal>
  )
}

export default OfflineMessageModal

OfflineMessageModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}
