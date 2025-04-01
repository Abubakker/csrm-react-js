const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleDownload = async (messageList) => {
  for (const message of messageList) {
    await downloadImage(message);
    await delay(500); // Increased delay to ensure downloads are properly handled
  }
};

const downloadImage = (message) => {
  return new Promise((resolve) => {
    const link = document.createElement('a');
    link.href = message.url;
    link.download = message.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Wait a bit to ensure the browser processes the download before resolving
    setTimeout(resolve, 100);
  });
};

// export const handleDownload = async (messageList) => {

//   messageList?.forEach((message) => {
//     const link = document.createElement('a');
//     link.href = message.url;
//     link.download = message.originalName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   });
// };

export const handleFileDownload = async (url, name) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.target = '_blank';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
