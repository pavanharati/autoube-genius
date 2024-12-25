import { useState } from "react";
import { Settings2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface SettingsFormValues {
  theme: "light" | "dark" | "system";
  channelName: string;
  notifications: boolean;
}

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      theme: "dark",
      channelName: "My YouTube Channel",
      notifications: true,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Settings saved:", data);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings2 className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account settings</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8">
            {/* Appearance */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Appearance</h2>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label htmlFor="dark">Dark</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system" />
                          <Label htmlFor="system">System</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Channel Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Channel Settings</h2>
              <FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will appear on your YouTube channel
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>Enable Notifications</FormLabel>
                      <FormDescription>
                        Receive notifications about your video status and performance
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-md font-medium"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Settings;