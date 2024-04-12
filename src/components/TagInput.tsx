import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  availableTags: string[];
  onSubmit: (data: { selectedTags: string[] }) => void;
  input?: string[];
}

const schema = z.object({
  selectedTags: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const TagInput: React.FC<TagInputProps> = ({ availableTags, onSubmit }) => {
  const { control, handleSubmit, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedTags: [],
    },
  });

  const [customTag, setCustomTag] = useState("");

  const addCustomTag = () => {
    if (customTag.trim() !== "") {
      setValue("selectedTags", [...selectedTags!, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (index: number) => {
    const newSelectedTags = [...selectedTags!];
    newSelectedTags.splice(index, 1);
    setValue("selectedTags", newSelectedTags);
  };

  const { selectedTags } = useWatch({ control });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        Available Tags:
        {availableTags.map((tag, index) => (
          <span key={index}>
            {!selectedTags!.includes(tag) && (
              <Badge
                className="mx-1"
                onClick={() => {
                  console.log("clicked");
                  setValue("selectedTags", [...selectedTags!, tag]);
                }}
              >
                {tag}
              </Badge>
            )}
          </span>
        ))}
      </div>
      <div>
        Selected Tags:
        {selectedTags!.map((tag, index) => (
          <span key={index}>
            <Badge onClick={() => removeTag(index)}>{tag}</Badge>
          </span>
        ))}
      </div>
      <div>
        <Input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
        />
        <Button onClick={addCustomTag}>Add Custom Tag</Button>
      </div>
      <Button>Submit</Button>
    </form>
  );
};

export default TagInput;
