type FormatDateTimeOptions = {
  locale?: "ar" | "en";
  monthStyle?: "numeric" | "long";
  arabicNumbers?: boolean;
};

export const formatDateTime = (
  timestamp: string,
  options: FormatDateTimeOptions = {}
): string => {
  const {
    locale = "en",
    monthStyle = "numeric",
    arabicNumbers = false,
  } = options;

  const date = timestamp ? new Date(timestamp) : new Date();

  const formatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA-u-ca-gregory" : "en-US",
    {
      day: "2-digit",
      month: monthStyle,
      year: "numeric",
    }
  );

  let formatted = formatter.format(date);

  if (arabicNumbers && locale === "ar") {
    formatted = formatted.replace(
      /[0-9]/g,
      (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)] ?? d
    );
  }

  return formatted;
};
