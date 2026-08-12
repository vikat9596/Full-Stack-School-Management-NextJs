"use client";

import { createStudent, updateStudent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { toDateInput } from "./formUtils";

const StudentForm = ({
  type,
  data,
  relatedData,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  relatedData?: {
    grades?: { id: number; level: number }[];
    classes?: { id: number; name: string }[];
    parents?: { id: string; name: string; surname: string }[];
  };
  setOpen?: (open: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      username: data?.username,
      email: data?.email || "",
      name: data?.name,
      surname: data?.surname,
      phone: data?.phone || "",
      address: data?.address,
      bloodType: data?.bloodType,
      sex: data?.sex,
      gradeId: data?.gradeId,
      classId: data?.classId,
      parentId: data?.parentId,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    { success: false, error: false, message: undefined as string | undefined }
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen?.(false);
      router.refresh();
    }
  }, [state, router, setOpen]);

  const onSubmit = handleSubmit((formValues) => {
    const fd = new FormData();
    if (data?.id) fd.append("id", data.id);
    Object.entries(formValues).forEach(([key, value]) => {
      if (value instanceof Date) fd.append(key, value.toISOString());
      else if (value !== undefined && value !== null) fd.append(key, String(value));
    });
    formAction(fd);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="Username" name="username" register={register} error={errors?.username} />
        <InputField label="Email" name="email" register={register} error={errors?.email} />
        <InputField label="Password" name="password" type="password" register={register} error={errors?.password} />
        <InputField label="First Name" name="name" register={register} error={errors.name} />
        <InputField label="Last Name" name="surname" register={register} error={errors.surname} />
        <InputField label="Phone" name="phone" register={register} error={errors.phone} />
        <InputField label="Address" name="address" register={register} error={errors.address} />
        <InputField label="Blood Type" name="bloodType" register={register} error={errors.bloodType} />
        <InputField
          label="Birthday"
          name="birthday"
          type="date"
          defaultValue={toDateInput(data?.birthday)}
          register={register}
          error={errors.birthday}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gradeId")} defaultValue={data?.gradeId}>
            {(relatedData?.grades || []).map((g) => (
              <option value={g.id} key={g.id}>{g.level}</option>
            ))}
          </select>
          {errors.gradeId?.message && <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("classId")} defaultValue={data?.classId}>
            {(relatedData?.classes || []).map((c) => (
              <option value={c.id} key={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.classId?.message && <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Parent</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("parentId")} defaultValue={data?.parentId}>
            {(relatedData?.parents || []).map((p) => (
              <option value={p.id} key={p.id}>{p.name} {p.surname}</option>
            ))}
          </select>
          {errors.parentId?.message && <p className="text-xs text-red-400">{errors.parentId.message.toString()}</p>}
        </div>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Something went wrong!"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
};

export default StudentForm;
