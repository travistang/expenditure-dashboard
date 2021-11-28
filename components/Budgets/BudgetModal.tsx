import { useMutation } from "@apollo/client";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import {
  BudgetModalMap,
  BudgetModalMode,
  DEFAULT_FORM_VALUE,
  FormValueType,
} from "../../constants/budgets";
import { CREATE_BUDGET, UPDATE_BUDGET } from "../../queries/budgets";
import {
  getCreateBudgetVariables,
  getUpdateBudgetVariables,
  validateForm,
} from "../../utils/budgets";
import { NumberInput, TextInput } from "../Form/Input";
import LabelsInput from "../Form/LabelsInput";

type Props = {
  onClose: () => void;
  onCreate: () => void;
  initialValue?: FormValueType;
};

export default function BudgetModal({
  onClose,
  onCreate,
  initialValue,
}: Props) {
  const isUpdating = !!initialValue?.id;
  const modalMode = isUpdating
    ? BudgetModalMode.UPDATING_BUDGET
    : BudgetModalMode.CREATING_BUDGET;
  const assets = BudgetModalMap[modalMode];

  const [mutate] = useMutation(isUpdating ? UPDATE_BUDGET : CREATE_BUDGET);
  const onSubmit = async () => {
    const variables = isUpdating
      ? getUpdateBudgetVariables(values, initialValue.id)
      : getCreateBudgetVariables(values);
    try {
      await mutate({
        variables,
      });
      onCreate();
    } catch (e) {
      toast.error(e);
    }
  };
  const formik = useFormik({
    initialValues: initialValue ?? DEFAULT_FORM_VALUE,
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
          {assets.header}
          {isUpdating && (
            <div className="text-xs font-bold text-opacity-70">
              id: {initialValue?.id}
            </div>
          )}
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
            <button type="submit" className="btn btn-primary flex gap-1">
              <FontAwesomeIcon icon={assets.ctaIcon} className="w-4 h-4" />
              {assets.cta}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
