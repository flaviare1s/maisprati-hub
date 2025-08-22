import { useFieldArray } from "react-hook-form";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { FaPlus, FaTimes } from "react-icons/fa";

export const TeamMembersForm = ({ control, register, watch, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  return (
    <div className="p-6 border-b bg-light rounded-md shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Membros do Time</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="mb-4 p-4 border rounded-md bg-gray-50 relative">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-red-secondary hover:text-red-700"
          >
            <FaTimes />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <InputField
              label="Nome do Membro"
              name={`members.${index}.name`}
              type="text"
              register={register}
              error={errors.members?.[index]?.name?.message}
              placeholder="Ex: João Silva"
            />

            <SelectField
              label="Função"
              name={`members.${index}.role`}
              register={register}
              options={[
                { value: 'leader', label: 'Líder' },
                { value: 'subleader', label: 'Sublíder' },
                { value: 'member', label: 'Membro' }
              ]}
            />

            {watch(`members.${index}.role`) === 'subleader' && (
              <InputField
                label="Tipo de Sublíder"
                name={`members.${index}.subLeaderType`}
                type="text"
                register={register}
                placeholder="Ex: Frontend"
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append({ name: '', role: 'member', specialization: '', subLeaderType: '' })}
          className="bg-blue-logo text-light px-4 py-2 rounded flex items-center gap-2 mt-2"
        >
          <FaPlus /> Adicionar Membro
        </button>
      </div>
    </div>
  );
};
