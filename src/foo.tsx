const Foo = () => {
  const { t } = useTranslation(["common", "analytics"]);
  return (
    <div>
      <h1>{t("common:okay")}</h1>

      <p>{t("analytics:analytics.overview")}</p>
    </div>
  );
};
