import { Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import { AddIcon, AttachmentIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { MdPhoto } from "react-icons/md";

const Addfile = ({setFile}) => {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
     setFile(file)
    // console.log("File selected:", file); // Handle file upload logic
  };

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setFile(image)
    // console.log("Image selected:", image); // Handle image upload logic
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<AddIcon />}
          aria-label="Options"
          variant="outline"
        />
        <MenuList>
          <MenuItem icon={<AttachmentIcon />} onClick={() => fileInputRef.current.click()}>Upload File</MenuItem>
          <MenuItem icon={<MdPhoto />} onClick={() => imageInputRef.current.click()}>Upload Image</MenuItem>
        </MenuList>
      </Menu>

      {/* Hidden file input for files */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Hidden file input for images */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </>
  );
};

export default Addfile;
