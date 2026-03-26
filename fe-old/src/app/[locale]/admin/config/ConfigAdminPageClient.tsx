"use client";

import { useEffect, useState } from "react";
import { authAxiosInstance } from "../../utils/axiosInstance";
import { fontMap } from "../../fonts";

type ConfigType = {
  id: number;
  lang: string;
  font: string;
  title: string;
  logo: string;
  phone: string;
  email: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  name: string;
  img: string;
  url: string;
  updatedAt: string | null;
};

type Props = {
  initialData: ConfigType[];
};

const LANGUAGES = ["vi", "en"];

export default function ConfigAdminPageClient({ initialData }: Props) {
  const [configs, setConfigs] = useState<ConfigType[]>([]);
  const [editingConfig, setEditingConfig] = useState<ConfigType | null>(null);
  const [activeLang, setActiveLang] = useState<string>("vi");
  const [multiLangForm, setMultiLangForm] = useState<
    Record<string, ConfigType>
  >({});

  useEffect(() => {
    setConfigs(initialData);
    const initialForm: Record<string, ConfigType> = {};
    LANGUAGES.forEach((lang) => {
      const config = initialData.find((c) => c.lang === lang);
      initialForm[lang] = config
        ? { ...config }
        : {
            id: 0,
            lang,
            font: "",
            title: "",
            logo: "",
            phone: "",
            email: "",
            description: "",
            ogTitle: "",
            ogDescription: "",
            name: "",
            img: "",
            url: "",
            updatedAt: null,
          };
    });
    setMultiLangForm(initialForm);
  }, [initialData]);

  const handleEdit = (config: ConfigType) => {
    setEditingConfig(config);
    setActiveLang("vi");
  };

  const handleChange = (lang: string, key: keyof ConfigType, value: any) => {
    setMultiLangForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value },
    }));
  };

  const handleSave = async () => {
    if (!editingConfig) return;

    try {
      await Promise.all(
        LANGUAGES.map(async (lang) => {
          const payload = { ...multiLangForm[lang] };
          const res = await authAxiosInstance.patch(
            `/config/${payload.id}`,
            payload
          );

          // Nếu 403, Axios sẽ ném lỗi, nên có thể catch riêng nếu muốn
          // Không cần check res.ok, vì Axios chỉ resolve khi status < 400
        })
      );

      const res = await authAxiosInstance.get("/config/lang/vi");
      setConfigs(res.data);
      setEditingConfig(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ có admin mới có thể thực hiện!");
      } else {
        console.error("Update failed", err);
      }
    }
  };

  const handleUpload = async (
    file: File,
    lang: string,
    field: "logo" | "img"
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await authAxiosInstance.post("/config/upload", formData);
      const data = res.data;

      if (data.success) {
        handleChange(lang, field, data.filePath);
      } else {
        alert("Upload thất bại");
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ có admin mới có thể thực hiện!");
      } else {
        console.error("Upload error:", err);
      }
    }
  };

  const handleDeleteFile = async (
    filePath: string,
    lang: string,
    field: "logo" | "img"
  ) => {
    try {
      await authAxiosInstance.post("/home/delete-file", { filePath });
      handleChange(lang, field, "");
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ có admin mới có thể thực hiện!");
      } else {
        console.error("Delete file error:", err);
      }
    }
  };

  return (
    <div className="p-10 mt-10 text-black max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cấu hình trang Web</h1>

      <table className="w-full border border-gray-300 mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {configs
            .filter((c) => c.lang === "vi")
            .map((c) => (
              <tr key={c.id}>
                <td className="border px-2 py-1">{c.id}</td>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.title}</td>
                <td className="border px-2 py-1">{c.description}</td>
                <td className="border px-2 py-1">{c.phone}</td>
                <td className="border px-2 py-1">{c.email}</td>
                <td className="border px-2 py-1">
                  <button
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                    onClick={() => handleEdit(c)}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {editingConfig && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white w-11/12 md:w-3/4 max-h-6/7 rounded-xl p-6 overflow-auto shadow-lg">
            <button
              onClick={() => setEditingConfig(null)}
              className="cursor-pointer absolute top-3 right-8 text-gray-600 hover:text-gray-800 text-4xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">Sửa Config</h2>
            <div className="flex gap-2 mb-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  className={`cursor-pointer px-3 py-1 rounded-md transition ${
                    activeLang === lang
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.title || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "title", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.description || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "description", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">Og Title</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.ogTitle || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "ogTitle", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  Og Description
                </label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.ogDescription || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "ogDescription", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.name || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "name", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Font</label>
                <select
                  value={multiLangForm[activeLang]?.font || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "font", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(fontMap).map((font) => {
                    const fontConfig = fontMap[font]; // { className, name }
                    return (
                      <option
                        key={font}
                        value={font}
                        className={fontConfig.className}
                        style={{
                          fontFamily: fontConfig.name,
                          fontSize: "16px",
                        }}
                      >
                        {font}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="font-medium text-gray-700">Logo</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="file"
                    id="logoUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, activeLang, "logo");
                    }}
                  />
                  <button
                    type="button"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                    onClick={() =>
                      document.getElementById("logoUpload")?.click()
                    }
                  >
                    Upload Logo
                  </button>
                  {multiLangForm[activeLang]?.logo && (
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow"
                      onClick={() =>
                        handleDeleteFile(
                          multiLangForm[activeLang]?.logo,
                          activeLang,
                          "logo"
                        )
                      }
                    >
                      Xóa
                    </button>
                  )}
                </div>
                {multiLangForm[activeLang]?.logo && (
                  <img
                    src={multiLangForm[activeLang]?.logo}
                    alt="Logo"
                    className="h-20 w-auto object-contain mt-2 border rounded-md shadow-sm"
                  />
                )}
              </div>

              {/* Image */}
              <div>
                <label className="font-medium text-gray-700">Image</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="file"
                    id="imgUpload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, activeLang, "img");
                    }}
                  />
                  <button
                    type="button"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                    onClick={() =>
                      document.getElementById("imgUpload")?.click()
                    }
                  >
                    Upload Image
                  </button>
                  {multiLangForm[activeLang]?.img && (
                    <button
                      type="button"
                      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow"
                      onClick={() =>
                        handleDeleteFile(
                          multiLangForm[activeLang]?.img,
                          activeLang,
                          "img"
                        )
                      }
                    >
                      Xóa
                    </button>
                  )}
                </div>
                {multiLangForm[activeLang]?.img && (
                  <img
                    src={multiLangForm[activeLang]?.img}
                    alt="img"
                    className="h-20 w-auto object-contain mt-2 border rounded-md shadow-sm"
                  />
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.phone || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "phone", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.email || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "email", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* URL */}
              <div>
                <label className="font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={multiLangForm[activeLang]?.url || ""}
                  onChange={(e) =>
                    handleChange(activeLang, "url", e.target.value)
                  }
                  className="mt-1 border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
                  onClick={handleSave}
                >
                  Cập nhật
                </button>
                <button
                  className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow-md"
                  onClick={() => setEditingConfig(null)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
