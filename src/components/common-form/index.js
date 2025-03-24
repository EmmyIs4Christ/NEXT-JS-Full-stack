import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function CommonForm({
  action,
  buttonText,
  formControls,
  btnType,
  btnIsDisabled,
  formData,
  setFormData,
  handleFileChange,
}) {
  function renderInputComponentType(currentControl) {
    let content = null;

    switch (currentControl.componentType) {
      case "input":
        content = (
          <div className="relative flex items-center mt-8">
            <Input
              type="text"
              disabled={currentControl.disabled}
              placeholder={currentControl.placeholder}
              id={currentControl.name}
              value={formData[currentControl.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [currentControl.name]: event.target.value,
                })
              }
              className="w-full roounded-md h-[60px] p-4 border bg-gray-100 text-lg outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        );

        break;

      case "file":
        content = (
          <Label
            htmlFor={currentControl.name}
            className="flex bg-gray-100 dark:bg-black items-center px-3 py-3 mx-auto mt-6 text-center border-2 border-dashed rounded-lg cursor-pointer"
          >
            <h2>{currentControl.label}</h2>
            <Input
              type="file"
              onChange={handleFileChange}
              id={currentControl.name}
            />
          </Label>
        );

      break;

      default:
        content = (
          <div className="relative flex items-center mt-8">
            <Input
              type='text'
              disabled={currentControl.disabled}
              placeholder={currentControl.placeholder}
              id={currentControl.name}
              value={formData[currentControl.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [event.target.name]: [event.target.value],
                })
              }
              className="w-full roounded-md h-[60px] px-4 border bg-gray-100  text-lg outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        );
        break;
    }
    return content;
  }
  // console.log(formControls, formData);

  return (
    <form action={action}>
      {formControls.map((control) => (
        <div key={control.name}>{renderInputComponentType(control)}</div>
      ))}
      <div className="mt-6 w-full">
        <Button
          type={btnType || "submit"}
          disabled={btnIsDisabled}
          className="disabled:opacity-60 flex h-11 items-center justify-center px-5"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
