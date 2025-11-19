import { AccountFormSchema } from "@/lib/schemas";
import { createAxiosInstance } from "@/lib/axios";
import { AxiosInstance } from "axios";
import { z } from "zod";

export class AuthService {
  protected instance: AxiosInstance;
  public constructor(url: string) {
    this.instance = createAxiosInstance(url);
  }

  refreshToken = async (refreshToken: string) => {
    const response = await this.instance.post("/auth/refresh-token", {
      refreshToken
    });
    return response;
  };

  logout = async () => {
    const response = await this.instance.post("/auth/logout", {});
    return response;
  };

  updateUserProfile = async (
    data: z.infer<typeof AccountFormSchema>,
    user: TUser
  ) => {
    const dataToSubmit = Object.keys(data)
      .filter((key) => {
        const safeKey = key as keyof z.infer<typeof AccountFormSchema>;
        return data[safeKey] !== undefined && data[safeKey] !== user[safeKey];
      })
      .reduce(
        (obj, key) => {
          const safeKey = key as keyof z.infer<typeof AccountFormSchema>;
          obj[safeKey] = data[safeKey];
          return obj;
        },
        {} as z.infer<typeof AccountFormSchema>
      );

    const response = await this.instance.patch(
      "/accounts/update-account",
      dataToSubmit
    );
    return response;
  };

  updateProfilePicture = async (picUrl: string) => {
    const response = await this.instance.patch("/profile/update-profile", {
      profilePicture: picUrl
    });
    return response;
  };
}
