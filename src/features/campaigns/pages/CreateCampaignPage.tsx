import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Shield, Lightbulb } from "lucide-react";
import { CreateCampaignSchema } from "../schema";
import type { CreateCampaignFormData } from "../schema";
import { getCategories } from "@/services/category.service";
import type { Category } from "@/services/category.service";
import { createCampaign } from "@/services/campaign.service";
import { useCurrentUser } from "@/features/auth/hooks";

import { Stepper } from "../components/CreateCampaign/Stepper";
import type { Step } from "../components/CreateCampaign/Stepper";
import { BasicStep } from "../components/CreateCampaign/BasicStep";
import { FinancialStep } from "../components/CreateCampaign/FinancialStep";
import { StoryStep } from "../components/CreateCampaign/StoryStep";
import { ReviewStep } from "../components/CreateCampaign/ReviewStep";

const STEP_BASIC = 0;
const STEP_FINANCIAL = 1;
const STEP_STORY = 2;
const STEP_REVIEW = 3;

export function CreateCampaignPage() {
  const navigate = useNavigate();

  const { data: user } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(STEP_BASIC);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === "DONOR") {
      navigate("/fundraiser/onboarding");
    }
  }, [user, navigate]);

  // Cast to any first to bypass complex Zod resolver input/output type mismatches
  // specifically caused by `z.coerce.number()` and `z.any()` for files
  const form = useForm<CreateCampaignFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateCampaignSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      shortDescription: "",
      categoryId: "",
      targetAmount: undefined as unknown as number,
      endDate: "",
      description: "",
      videoUrl: "",
      image: undefined,
    },
  });

  useEffect(() => {
    // Fetch categories for the form
    getCategories().then(setCategories);
  }, []);

  const steps: Step[] = [
    {
      label: "Dasar",
      active: currentStep === STEP_BASIC,
      done: currentStep > STEP_BASIC,
    },
    {
      label: "Finansial",
      active: currentStep === STEP_FINANCIAL,
      done: currentStep > STEP_FINANCIAL,
    },
    {
      label: "Cerita",
      active: currentStep === STEP_STORY,
      done: currentStep > STEP_STORY,
    },
    {
      label: "Tinjau",
      active: currentStep === STEP_REVIEW,
      done: currentStep > STEP_REVIEW,
    },
  ];

  const handleNext = async () => {
    // Trigger validation based on current step
    let fieldsToValidate: (keyof CreateCampaignFormData)[] = [];
    if (currentStep === STEP_BASIC) {
      fieldsToValidate = ["title", "shortDescription", "categoryId"];
    } else if (currentStep === STEP_FINANCIAL) {
      fieldsToValidate = ["targetAmount", "endDate"];
    } else if (currentStep === STEP_STORY) {
      fieldsToValidate = ["description", "image", "videoUrl"];
    }

    const isStepValid = await form.trigger(
      fieldsToValidate as Parameters<typeof form.trigger>[0],
    );
    if (isStepValid && currentStep < STEP_REVIEW) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setSubmitError(null);
    if (currentStep > STEP_BASIC) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: CreateCampaignFormData) => {
    // Guard: Only allow submission if we are on the review step
    if (currentStep < STEP_REVIEW) {
      handleNext();
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("shortDescription", data.shortDescription);
      formData.append("categoryId", data.categoryId);
      formData.append("targetAmount", data.targetAmount.toString());
      formData.append("endDate", new Date(data.endDate).toISOString());
      formData.append("description", data.description);
      if (data.videoUrl) {
        formData.append("videoUrl", data.videoUrl);
      }
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await createCampaign(formData);

      // Redirect to success or detail page
      navigate("/explore"); // Replace with specific detail/success page later if exists
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setSubmitError(
        err?.response?.data?.message ||
          "Terjadi kesalahan sistem saat menyimpan campaign.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Stepper steps={steps} onStepClick={(idx) => setCurrentStep(idx)} />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting the form prematurely
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
            handleNext();
          }
        }}
      >
        {currentStep === STEP_BASIC && (
          <BasicStep form={form} categories={categories} />
        )}
        {currentStep === STEP_FINANCIAL && <FinancialStep form={form} />}
        {currentStep === STEP_STORY && <StoryStep form={form} />}
        {currentStep === STEP_REVIEW && (
          <ReviewStep form={form} categories={categories} />
        )}

        {submitError && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
            {submitError}
          </div>
        )}

        <div className="pt-8 mt-12 flex justify-between items-center border-t">
          <Button
            type="button"
            variant="ghost"
            className={`gap-2 text-slate-400 font-bold ${currentStep === STEP_BASIC ? "invisible" : ""}`}
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" /> Kembali
          </Button>

          {currentStep < STEP_REVIEW ? (
            <Button
              key="btn-next"
              type="button"
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl h-14 px-12 text-lg font-black shadow-xl shadow-green-200"
            >
              Lanjutkan
            </Button>
          ) : (
            <Button
              key="btn-submit"
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl h-14 px-12 text-lg font-black shadow-xl shadow-green-200 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Kirim untuk Review"}
            </Button>
          )}
        </div>
      </form>

      {/* Bottom Info */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center border-t pt-12 opacity-50">
        <div className="space-y-1">
          <Shield className="h-6 w-6 mx-auto mb-3 text-slate-400" />
          <p className="text-xs font-black text-slate-900 uppercase">
            Input Aman
          </p>
          <p className="text-[10px] text-slate-500 uppercase font-black">
            Data dilindungi enkripsi
          </p>
        </div>
        <div className="space-y-1">
          <CheckIcon className="h-6 w-6 mx-auto mb-3 text-slate-400" />
          <p className="text-xs font-black text-slate-900 uppercase">
            Dukungan 24/7
          </p>
          <p className="text-[10px] text-slate-500 uppercase font-black">
            Pusat bantuan siap melayani
          </p>
        </div>
        <div className="space-y-1">
          <Lightbulb className="h-6 w-6 mx-auto mb-3 text-slate-400" />
          <p className="text-xs font-black text-slate-900 uppercase">
            Tips Campaign
          </p>
          <p className="text-[10px] text-slate-500 uppercase font-black">
            Cara tingkatkan donasi
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
