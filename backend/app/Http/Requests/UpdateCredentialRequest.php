<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCredentialRequest extends FormRequest
{
    /**
     * Sanitize input before validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('status') && $this->input('status') === '') {
            $this->merge(['status' => null]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // For now, allow all authenticated users
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'candidate_name' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'credential_type' => ['sometimes', 'required', 'string', 'max:255'],
            'issue_date' => ['sometimes', 'required', 'date'],
            'expiry_date' => ['sometimes', 'required', 'date'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'status' => ['sometimes', 'nullable', 'string', 'in:active,expired,expiring_soon,pending'],
            'document' => ['sometimes', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];

        // If both issue_date and expiry_date are provided, ensure expiry_date is after issue_date
        if ($this->has('issue_date') && $this->has('expiry_date')) {
            $rules['expiry_date'][] = 'after:issue_date';
        } elseif ($this->has('expiry_date')) {
            // If only expiry_date is provided, check against existing issue_date
            $credential = $this->route('credential') ?? $this->route('id');
            if ($credential) {
                $credentialModel = \App\Models\Credential::find($credential);
                if ($credentialModel && $credentialModel->issue_date) {
                    $rules['expiry_date'][] = 'after:' . $credentialModel->issue_date->format('Y-m-d');
                }
            }
        }

        return $rules;
    }
}
