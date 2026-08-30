import { useLocation, useNavigate, useParams as useRouteParams, useSearchParams as useRouteSearchParams } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: navigate,
    replace: (path) => navigate(path, { replace: true }),
    back: () => navigate(-1)
  };
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  return useRouteSearchParams()[0];
}

export const useParams = useRouteParams;
