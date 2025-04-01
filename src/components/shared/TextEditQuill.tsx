import { useTranslation } from 'react-i18next';
import QuillEditor from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './style.css'

const TextEditQuill = ({body,setBody}:any) => {
    const {t}=useTranslation()
    const toolbarOptions = [
        [{ font: [] }, { size: [] }],
        [{ align: "" }, { align: "center" }, { align: "right" }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ];
    
    return (
        <div className='customTextEditor flex flex-col'>
        <QuillEditor
         value={body}
         onChange={(content) => {
             setBody(content);
         }}
         placeholder={`${t('writeEmailHere')}`}
         theme="snow"
         modules={{ toolbar: toolbarOptions }}
         className="min-h-[300px]"
       />
       </div>
    );
};

export default TextEditQuill;