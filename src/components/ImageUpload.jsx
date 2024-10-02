import { useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button } from 'antd';
import styled from 'styled-components';

const UploadButton = styled(Button)`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const UploadWidget = ({ onChange }) => {
  const widget = useRef();

  useEffect(() => {
    if (!window.cloudinary) {
      console.warn('Cloudinary is not loaded');
      return;
    }

    if (!widget.current) {
      widget.current = createWidget();
    }

    return () => {
      widget.current?.destroy();
      widget.current = undefined;
    };
  }, []);

  const createWidget = () => {
    const cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env
      .VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    return window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
      },
      (error, result) => {
        if (result.event === 'success') {
          onChange(result.info.secure_url);
        }
      },
    );
  };

  const openWidget = () => {
    if (!widget.current) {
      widget.current = createWidget();
    }
    widget.current.open();
  };

  return (
    <div>
      <UploadButton type="primary" onClick={openWidget}>
        <FaPlus />
        Upload Image
      </UploadButton>
    </div>
  );
};

export default UploadWidget;
