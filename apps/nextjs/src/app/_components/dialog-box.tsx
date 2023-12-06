import * as Dialog from "@radix-ui/react-dialog";

interface DialogBoxProps {
  title: string;
  children?: { name: string }[];
}

export const DialogBox: React.FC<DialogBoxProps> = ({ title, children }) => {
  //console.log(children);
  return (
    <div>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <Dialog.Content
        className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-4 shadow-lg"
        style={{ width: "30rem" }}
      >
        <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
        <Dialog.Description className="text-sm">
          {children?.map((child, index) => (
            <p key={index}>
              <span>
                {child.name}
                {index < children.length - 1 ? ", " : ""}
              </span>
            </p>
          ))}
        </Dialog.Description>
      </Dialog.Content>
    </div>
  );
};
