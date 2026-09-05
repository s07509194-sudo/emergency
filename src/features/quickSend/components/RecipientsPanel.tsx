import { useMemo, useState } from "react";
import { Users, User, ChevronDown, X } from "lucide-react";
import { mockContacts, mockGroups, type Contact } from "../data/mockData";

interface RecipientsPanelProps {
  selectedContactIds: number[];
  onChangeSelectedContactIds: (ids: number[]) => void;
  selectedGroupIds: number[];
  onChangeSelectedGroupIds: (ids: number[]) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function RecipientsPanel({
  selectedContactIds,
  onChangeSelectedContactIds,
  selectedGroupIds,
  onChangeSelectedGroupIds,
}: RecipientsPanelProps) {
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockContacts;
    return mockContacts.filter((c) =>
      [c.firstName, c.lastName, c.mobile, c.email, c.jobNumber]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  const toggleContact = (id: number) => {
    onChangeSelectedContactIds(
      selectedContactIds.includes(id)
        ? selectedContactIds.filter((c) => c !== id)
        : [...selectedContactIds, id]
    );
  };

  const toggleGroup = (id: number) => {
    onChangeSelectedGroupIds(
      selectedGroupIds.includes(id)
        ? selectedGroupIds.filter((g) => g !== id)
        : [...selectedGroupIds, id]
    );
  };

  const allOnPageSelected =
    pageContacts.length > 0 && pageContacts.every((c) => selectedContactIds.includes(c.id));

  const toggleSelectAllOnPage = () => {
    if (allOnPageSelected) {
      onChangeSelectedContactIds(
        selectedContactIds.filter((id) => !pageContacts.some((c) => c.id === id))
      );
    } else {
      const pageIds = pageContacts.map((c) => c.id);
      onChangeSelectedContactIds([...new Set([...selectedContactIds, ...pageIds])]);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const selectedCount =
    activeTab === "contacts" ? selectedContactIds.length : selectedGroupIds.length;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">المستلمون</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "contacts"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <User size={15} />
            جهات الاتصال {mockContacts.length}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("groups")}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "groups"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Users size={15} />
            المجموعات {mockGroups.length}
          </button>
        </div>
      </div>

      {activeTab === "contacts" ? (
        <>
          {/* شريط البحث والتحكم */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search"
                  className="w-56 rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="مسح البحث"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={clearSearch}
                className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50"
              >
                مسح
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                SELECTED ({selectedContactIds.length})
              </span>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAllOnPage}
                  className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                />
                تحديد الجميع
              </label>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 focus:border-emerald-500 focus:outline-none"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>

          {/* الجدول */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold">الاسم الأول</th>
                  <th className="px-4 py-3 text-right font-semibold">الاسم الأخير</th>
                  <th className="px-4 py-3 text-right font-semibold">الهاتف المتحرك</th>
                  <th className="px-4 py-3 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right font-semibold">الرقم الوظيفي</th>
                  <th className="px-4 py-3 text-center font-semibold"> </th>
                </tr>
              </thead>
              <tbody>
                {pageContacts.map((c: Contact) => (
                  <tr
                    key={c.id}
                    className="border-t border-slate-50 hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-3 text-slate-700">{c.firstName}</td>
                    <td className="px-4 py-3 text-slate-700">{c.lastName}</td>
                    <td className="px-4 py-3 text-slate-500" dir="ltr">
                      {c.mobile}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.email}</td>
                    <td className="px-4 py-3 text-slate-500">{c.jobNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedContactIds.includes(c.id)}
                        onChange={() => toggleContact(c.id)}
                        className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                      />
                    </td>
                  </tr>
                ))}

                {pageContacts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      لا يوجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* الباجيناشن */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
            >
              NEXT
            </button>

            {Array.from({ length: totalPages }, (_, i) => totalPages - i).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-full text-sm font-semibold transition-colors ${
                  n === currentPage
                    ? "bg-slate-700 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
            >
              PREVIOUS
            </button>
          </div>
        </>
      ) : (
        /* تبويب المجموعات */
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mockGroups.map((g) => {
            const isChecked = selectedGroupIds.includes(g.id);
            return (
              <label
                key={g.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  isChecked
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">{g.name}</p>
                  <p className="text-xs text-slate-400">{g.membersCount} عضو</p>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleGroup(g.id)}
                  className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                />
              </label>
            );
          })}
        </div>
      )}

      {/* خيارات إضافية */}
      <button
        type="button"
        onClick={() => setShowAdditionalOptions((s) => !s)}
        className="mt-6 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600"
      >
        خيارات إضافية
        <ChevronDown
          size={16}
          className={`transition-transform ${showAdditionalOptions ? "rotate-180" : ""}`}
        />
      </button>

      {showAdditionalOptions && (
        <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
            إرسال تذكير تلقائي في حالة عدم الرد خلال ساعة
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
            تسجيل الإشعار ضمن تقارير الإشعارات
          </label>
        </div>
      )}

      <p className="mt-4 text-xs font-medium text-slate-400">
        إجمالي المحدد: {selectedCount} من {activeTab === "contacts" ? mockContacts.length : mockGroups.length}
      </p>
    </div>
  );
}
