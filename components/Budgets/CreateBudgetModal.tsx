import { useMutation } from "@apollo/client";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Budget } from "@prisma/client";
import { FormikErrors, useFormik } from "formik";
import toast from "react-hot-toast";
import { BudgetCreateInput } from "../../prisma/generated/type-graphql";
import { CREATE_BUDGET } from "../../queries/budgets";
import { NumberInput, TextInput } from "../Form/Input";
import LabelsInput from "../Form/LabelsInput";

type Props = {
  onClose: () => void;
  onCreate: () => void;
};
type FormValueType = Omit<Budget, "id">;
const DEFAULT_FORM_VALUE: FormValueType = {
  amount: 0,
  name: "",
  includedLabels: [],
  excludedLabels: [],
};
const validateForm = (
  pendingBudget: FormValueType
): FormikErrors<FormValueType> => {
  const { amount, name, includedLabels, excludedLabels } = pendingBudget;
  const errors: FormikErrors<FormValueType> = {};
  if (amount <= 0) {
    errors.amount = "Invalid amount";
  }
  if (!name) {
    errors.name = "Invalid budget name";
  }
  const allLabels = [...includedLabels, ...excludedLabels];
  if (allLabels.length === 0) {
    const errorMessage = "At least one of the labels have to be provided";
    errors.includedLabels = errorMessage;
    errors.excludedLabels = errorMessage;
  }
  if ([...new Set(allLabels)].length < allLabels.length) {
    const errorMessage = "Some inputs are repeated";
    errors.includedLabels = errorMessage;
    errors.excludedLabels = errorMessage;
  }
  return errors;
};

export default function CreateBudgetModal({ onClose, onCreate }: Props) {
  const [createBudget] = useMutation(CREATE_BUDGET);
  const onSubmit = async () => {
    const data: BudgetCreateInput = {
      ...values,
      includedLabels: { set: values.includedLabels },
      excludedLabels: { set: values.excludedLabels },
    };
    try {
      await createBudget({ variables: { data } });
      onCreate();
    } catch (e) {
      toast.error(e);
    }
  };
  const formik = useFormik({
    initialValues: DEFAULT_FORM_VALUE,
    onSubmit,
    validate: validateForm,
  });
  const values = formik.values;

  return (
    <div className="inset-0 fixed z-20 flex flex-col items-stretch justify-end md:items-center md:justify-center bg-base-300 bg-opacity-60">
      <div
        className="rounded-t-2xl md:rounded-b-2xl bg-base-100 p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-ghost absolute right-4 top-4 p-1 w-8 h-8"
          onClick={onClose}
          type="button"
        >
          <FontAwesomeIcon
            icon={faTimes}
            className="w-4 h-4 text-base-content"
          />
        </button>
        <h3 className="text-lg font-bold pb-4 py-0 my-0">
          Create a new budget
        </h3>
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-12 gap-2"
        >
          <TextInput
            bordered
            className="col-span-full"
            onChange={formik.handleChange}
            label="Budget name"
            name="name"
            value={formik.values.name}
            error={formik.errors.name?.toString()}
            placeholder="Budget name"
          />
          <NumberInput
            className="col-span-4"
            onChange={formik.handleChange}
            label="Amount"
            unit="€"
            name="amount"
            accent="primary"
            value={formik.values.amount}
          />
          <LabelsInput
            name="includedLabels"
            label="Included labels"
            values={formik.values}
            errors={formik.errors}
            handleChange={formik.handleChange}
            setValues={formik.setValues}
            setFieldValue={formik.setFieldValue}
          />
          <LabelsInput
            name="excludedLabels"
            label="Excluded labels"
            values={formik.values}
            errors={formik.errors}
            handleChange={formik.handleChange}
            setValues={formik.setValues}
            setFieldValue={formik.setFieldValue}
          />
          <div className="flex flex-grow-0 col-span-full pt-4 items-center justify-end">
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              Add budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
